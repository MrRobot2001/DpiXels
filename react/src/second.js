import React,{useState,useEffect} from 'react'
import './second.css'
import Identicon from 'identicon.js'

export function Second({captureFile, uploadImage, tipImageOwner, images}) {
    const [Description, setDescription] = useState('')

    const handleChangeInput = event => {
        setDescription(event.target.value)
    }
    
    const submitFile = () => {
        uploadImage(Description);
        setDescription('')
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <main role="main" className="main" style={{ maxWidth: "500px"}}>
                    <div className="ml-auto mr-auto">
                        <p>&nbsp;</p>
                        <h3>Share Image</h3>
                        <form>
                            <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile} className="input_1"/>
                            <div className="form-group mr-sm-2">
                                <br></br>
                                <input
                                name="Description"
                                value={Description}
                                type="text"
                                onChange={handleChangeInput}
                                className="form-control input_2"
                                placeholder="Image Description..."
                                required/>
                            </div>
                            <button type="submit" className="btn btn-primary button" onClick={() => submitFile()}>Upload</button>
                        </form>
                        <p>&nbsp;</p>
                        {
                            images.map((img, key) => {
                                return(
                                <div className="card mb-4" key={key}>
                                    <div className="card-header display_3">
                                        <img className='img'
                                        width='35'
                                        height='35'
                                        alt={img.author}
                                        src={`data:image/png;base64,${new Identicon(img.author, 720).toString()}`}
                                        />
                                        <small className="text-muted small_1">{img.author}</small>
                                    </div>
                                    <ul id="imageList" className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <p className="text-center"><img src={`https://ipfs.io/ipfs/${img.ipfsHash}`} style={{ maxWidth: '430px'}} alt="from ipfs"/></p>
                                            <p className="p_2">{img.description}</p>
                                        </li>
                                        <li key={key} className="list-group-item py-1 li_1">
                                            <small className="float-left md-1 text-muted">
                                                TIPS: {window.web3.utils.fromWei(img.tipAmount.toString(), 'Ether')} ETH
                                            </small>
                                            <button className="btn btn-link btn-sm float-right pt-0 button_2"
                                            name={img.id}
                                            onClick={(event) => {
                                                let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                                                tipImageOwner(event.target.name, tipAmount)
                                            }}>TIP 0.1 ETH</button>
                                        </li>
                                    </ul>
                                </div>
                            )})
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Second;
