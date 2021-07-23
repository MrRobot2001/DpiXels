const DpiXels = artifacts.require('DpiXels')

require('chai').use(require('chai-as-promised')).should()

contract('DpiXels', ([deployer, author, tipper]) => {
    let dpixels

    before(async () => {
        dpixels = await DpiXels.deployed()
    })

    describe('deployment' , async () => {
        it('successfull', async () => {
            const address = await dpixels.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })

    it('Main Project Name', async () => {
        const name = await dpixels.name()
        assert.equal(name, 'DpiXels')
    })

    describe('images', async () => {
        let result,imageCount;
        const hash = 'cde456';

        before(async () => {
            result = await dpixels.uploadImage(hash, 'Image Description', {from: author})
            imageCount = await dpixels.imageCount()
        })

        it('creates Images', async () => {
            assert.equal(imageCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(event.ipfsHash, hash, 'Hash is correct')
            assert.equal(event.description, 'Image Description', 'description is correct')
            assert.equal(event.tipAmount, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            await dpixels.uploadImage('', 'Image Description', {from: author}).should.be.rejected;
            await dpixels.uploadImage(hash, '', {from: author}).should.be.rejected;
        })

        it('list images', async () =>{
            const image = await dpixels.images(imageCount)
            assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(image.ipfsHash, hash, 'Hash is correct')
            assert.equal(image.description, 'Image Description', 'description is correct')
            assert.equal(image.tipAmount, '0', 'tip amount is correct')
            assert.equal(image.author, author, 'author is correct')
        })

        it('users tip images', async () => {
            let authorBalance;
            authorBalance = await web3.eth.getBalance(author)
            authorBalance = new web3.utils.BN(authorBalance)

            result = await dpixels.tipImageOwner(imageCount, {from: tipper, value: web3.utils.toWei('1','Ether')})

            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(event.ipfsHash, hash, 'Hash is correct')
            assert.equal(event.description, 'Image Description', 'description is correct')
            assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            let authorBalanceNew;
            authorBalanceNew = await web3.eth.getBalance(author)
            authorBalanceNew = new web3.utils.BN(authorBalanceNew)

            let tipImageOwner;
            tipImageOwner = await web3.utils.toWei('1','Ether')
            tipImageOwner = new web3.utils.BN(tipImageOwner)

            const expectedBalance = authorBalance.add(tipImageOwner)

            assert.equal(authorBalanceNew.toString(), expectedBalance.toString())

            await dpixels.tipImageOwner(99, {from: tipper, value: web3.utils.toWei('1','Ether')}).should.be.rejected;
        })
    })
})