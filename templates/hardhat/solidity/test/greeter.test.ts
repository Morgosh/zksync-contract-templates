import { expect } from 'chai';
import { deployContract, getRichWallets } from '../deploy/utils';

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    const wallet = (await getRichWallets())[0];

    const greeting = "Hello world!";
    const greeter = await deployContract("Greeter", [greeting], { wallet, doLog: false });

    expect(await greeter.greet()).to.eq(greeting);

    const newGreeting = "Hola, mundo!";
    const setGreetingTx = await greeter.setGreeting(newGreeting);
    
    // wait until the transaction is processed
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal(newGreeting);
  });
});
