pragma solidity >=0.6.5 <0.9.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./abstracts/BotPrevent.sol";

/**
 * @title TES Token
 * @dev ERC20 based Token, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 */
contract TESToken is Context, ERC20, Ownable, AccessControl {
    
    
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    using SafeMath for uint256;

    IUniswapV2Router02 public pancakeswapV2Router;
    address public swapBalanceAddress;    
    address public pancakeswapV2Pair;
    
    uint256 private maxSupply;
    
    uint256 private _buyFeeForRate = 0;
	uint256 private _sellFeeForRate = 0;
	
	mapping(address => bool) private whiteList;	

	mapping(address => bool) private _isExcludedFromFee;
    mapping(address => bool) private _isExcluded;
    
    bool public bpEnabled = false;
    
    uint256 public swapLockTime = 0;
    uint256 public blacklistTime = 0;

    receive() external payable  { 
    }

    fallback() external payable {
    }

    /**
     *  Constructor that gives msg.sender all of existing tokens.
    */
    constructor() ERC20("Titan Trading", "TES") {
        maxSupply = 100 * 10 ** 6 * (10 ** uint256(decimals()));
        _mint(_msgSender(), maxSupply); // total 100.000.000 TES
        
        // setup role default for sender
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(BURNER_ROLE, _msgSender());
        
        _isExcludedFromFee[owner()] = true; // Owner doesn't pay fees (e.g. when adding liquidity)
        _isExcludedFromFee[address(this)] = true; // Contract address doesn't pay fees
    }
    
    function initSwap(address routerAddress) external onlyOwner {
        // implement logic for uniswap
        require(block.timestamp >= swapLockTime, "SWAPLOCKTIME: INVALID");
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
			routerAddress
		);

		pancakeswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
			.createPair(address(this), _uniswapV2Router.WETH());

		pancakeswapV2Router = _uniswapV2Router;
		
		// lock swap dex for token in 365 days
		swapLockTime = block.timestamp + 365 days;
        
    }
    
    function excludeFromFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = true;
    }
    
    function setPairAddress(address pairAddress) public onlyOwner {
        require (pancakeswapV2Pair == address(0));
        pancakeswapV2Pair = pairAddress;
    }
    
    // BUY/SELL FEE
    function setSellFeeRate(uint256 fee) external onlyOwner {
        require(fee <= 6, "fee need to set lower than 6%");
        _sellFeeForRate = fee;
    }

    function setBuyFeeRate(uint256 fee) external onlyOwner {
        require(fee >= 0, "fee need to set greater than equal 0%");
        _buyFeeForRate = fee;
    }
    
    function getFees() external view returns(uint256 buyFee, uint256 sellFee) {
        return (_buyFeeForRate, _sellFeeForRate);
    }
    
    function calculateFee(uint256 amount, uint256 fee) private pure returns(uint256) {
        return (amount * fee).div(100);
    }
    
    function setSwapBalance(address _swapBalanceAddress) external onlyOwner {
		require(_swapBalanceAddress != address(0), "0x or owner is not accepted here");

		swapBalanceAddress = _swapBalanceAddress;
		emit EventChangeSwapBalanceAddress(_swapBalanceAddress);
	}
    
    function setWhiteLists(address target) external onlyOwner {
		require(!whiteList[target]);

		whiteList[target] = true;
		emit EventWhiteList(target, true);
	}

	function removeWhiteLists(address target) external onlyOwner {
		require(whiteList[target]);

		whiteList[target] = false;
		emit EventWhiteList(target, false);
	}	
	
	function updateSwapBalance(uint256 amount) external onlyOwner {
		uint256 contractSwapBalance = balanceOf(address(this));
		require(amount <= contractSwapBalance, "cannot enough token for swapping");
		swapTokensForETH(amount);
	}
	
	function swapTokensForETH(uint256 tokenAmount) public onlyOwner { 
	    // Generate the pancakeswap pair path of token -> BNB
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = pancakeswapV2Router.WETH();
        _approve(address(this), address(pancakeswapV2Router), tokenAmount);
        
        try pancakeswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens( // Make the swap
            tokenAmount,
            0, // accept any amount of BNB/ETH
            path,
            swapBalanceAddress, // sent to contract 
            block.timestamp
        ) {

           }
        catch 
        {
            emit Log("external call failed");
        }
    }
    
    // setup fee rate with transter
    function _transfer(
		address sender,
		address recipient,
		uint256 amount
	) internal virtual override {	
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

		uint256 transferFeeRate = 0;

		if (!whiteList[sender] || !whiteList[recipient]) {
			if (recipient == pancakeswapV2Pair){
			    transferFeeRate = _sellFeeForRate;
			}
		}

		if (transferFeeRate > 0) {
			uint256 _fee = calculateFee(amount, transferFeeRate);
			super._transfer(sender, address(this), _fee); // TransferFee
			amount = amount.sub(_fee);
		}

		super._transfer(sender, recipient, amount);
	}
	
	function burn(uint256 amount) public onlyOwner {
		_burn(_msgSender(), amount);
	}
	
	event EventWhiteList(address indexed target, bool state);
	event EventChangeSwapBalanceAddress(address indexed addr);
	event Log(string message);

}
