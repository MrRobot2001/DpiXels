// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DpiXels{
    string public name = "DpiXels";
    
    mapping(uint => Image) public images;
    uint public imageCount = 0;
    struct Image{
        uint id;
        string ipfsHash;
        string description;
        uint tipAmount;
        address payable author;
    }

    event ImageUpload(
        uint id,
        string ipfsHash,
        string description,
        uint tipAmount,
        address payable author
    );

    event TipImage(
        uint id,
        string ipfsHash,
        string description,
        uint tipAmount,
        address payable author
    );

    function uploadImage(string memory _ipfshash, string memory _description) public {
        require(bytes(_ipfshash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));

        imageCount++;
        images[imageCount] = Image(imageCount, _ipfshash, _description, 0, msg.sender);
        emit ImageUpload(imageCount, _ipfshash, _description, 0, msg.sender);
    }

    function tipImageOwner(uint _id) payable public {
        require(_id > 0 && _id <= imageCount);

        Image memory _image = images[_id];
        address payable _author = _image.author;
        _author.transfer(msg.value);
        _image.tipAmount += msg.value;
        images[_id] = _image;
        emit TipImage(_id, _image.ipfsHash, _image.description, _image.tipAmount, _author);
    }
}
