const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    let validAddress;
    //loop until find valid address
    while (!validAddress) {
        wallet = ethers.Wallet.createRandom();
        address = await wallet.getAddress();
        if (address < threshold) {
          console.log("Valid address: ",address)
            validAddress = true;
        }
    };
    //then add balance in valid address for tx gas fee
    wallet = wallet.connect(ethers.provider);
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther("100")
    });
    return { game,wallet};
  }
  it('should be a winner', async function () {
    const { game,wallet } = await loadFixture(deployContractAndSetVariables);
    
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});

/*
The value 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf cannot be used as an address value in Ethereum,
because the address space is defined as a 20-byte (160-bit) value, and the minimum value for a 20-byte 
value is 0x0000000000000000000000000000000000000000.

In Ethereum, addresses are derived from the public key of an Ethereum account, 
which is the result of the SHA-3 hash of the public key. The address is then derived from
 the last 20 bytes of the hash. As a result, 
 the minimum value for an Ethereum address is 0x0000000000000000000000000000000000000000.

If you want to use a value as an address, you will need to ensure that it is a valid Ethereum address. 
A valid Ethereum address is a 20-byte (160-bit) value that is greater 
than or equal to 0x0000000000000000000000000000000000000000.

*/ 