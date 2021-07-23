import React,{useState,useEffect,useCallback} from 'react';
import Web3 from 'web3';
import Second from './second';
import Navbar from './Navbar';
import Dpixels from './abis/DpiXels.json';

function App() {
  const IPFS = require('ipfs-api')
  const ipfs = new IPFS({host: 'ipfs.infura.io', port:5001, protocol: 'https'})
  const [account, setAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [dpixel, setDpixel] = useState(null)
  const [images, setImages] = useState([])
  const [file, setFile] = useState('')
  
  const loadWeb3 = async () => {
    if(window.etheruem){
      window.web3 = new Web3(window.etheruem)
      await window.etheruem.enable();
    }
    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. Consider using metamask or web3 compatible browser.')
    }
  }

  const loadBlockchainData = async () => {
    await loadWeb3();
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = Dpixels.networks[networkId]
    if(networkData){
      const dpixels = new web3.eth.Contract(Dpixels.abi, networkData.address)
      setDpixel(dpixels)
      const imageCount = await dpixels.methods.imageCount().call();
      for(let i = 1; i <= imageCount; i++){
        const image = await dpixels.methods.images(i).call()
        setImages([...images, image])
      }
      setImages(images.sort((a,b) => b.tipAmount - a.tipAmount))
      setLoading(false)
    }else{
      window.alert('Dpixel contract has not been deployed to the detected network.')
    }
  }

  const captureFile = e => {
    e.preventDefault()
    const File = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(File)

    reader.onloadend = () => {
      let buffer = Buffer(reader.result)
      setFile(buffer)
    }
  }

  const uploadImage = (description) => {
    ipfs.add(file, (err, result) => {
      console.log('ipfs result',result)
      if(err){
        console.log(err)
        return
      }
      setLoading(true)
      dpixel.methods.uploadImage(result[0].hash, description).send({from: account }).on('transactionHash', (hash) => {
        setLoading(false)
      })
    })
  }

  const tipImageOwner = async (id, tipAmount) => {
    setLoading(true)
    dpixel.methods.tipImageOwner(id).send({from: account, value: tipAmount}).on('transactionHash', (hash) => {
      setLoading(false)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  },[loadWeb3])

  return (
    <div>
      <Navbar Account={account}/>
      {
        loading
        ? <div id="loader" className="text-center mt-5"><h2>Loading.....</h2></div>
        : <Second captureFile={captureFile} uploadImage={uploadImage} tipImageOwner={tipImageOwner} images={images}/>
      }
    </div>
  );
}

export default App;
