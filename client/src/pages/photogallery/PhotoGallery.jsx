import { useEffect, useState } from "react";
import "./PhotoGallery.css";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import Modal from "../../components/modal/Modal";

const PhotoGallery = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const [gallery, setGallery] = useState([{}]);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [modalContant, setModalContant] = useState("");

  useEffect(() => {
    getUploadedImages();
  }, [selectedFile]);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const response = await axios("http://localhost:3008/api/uploadprogress");
  //     setProgress(response.data);
  //   }, 500);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const getUploadedImages = async () => {
    const response = await axios("http://localhost:3008/api/getimages", {
      method: "GET",
    });
    setGallery(response.data);
  };

  const handleImage = (event) => {
    const { name } = event.target.files[0];
    const image = event.target.files[0];
    setSelectedFile(name);
    uploadImage(image);
  };
  const uploadImage = async (image) => {
    console.log("🚀 ~ file: PhotoGallery.jsx:20 ~ uploadImage ~ image:", image);
    const formData = new FormData();
    formData.append("upload_file", image);

    const response = await axios("http://localhost:3008/api/upload", {
      method: "POST",
      header: { "Content-Type": "multipart/form-data" },
      data: formData,
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setProgress(progress);
      },
    });
    if (response.status == 200) {
       setSelectedFile("");
      setProgress(0);
    }
  };

  const handleImageView = (fileName) => {
    setIsOpen(true);
    setModalContant(fileName);
  };

  return (
    <div className="photo-gallery-conatiner">
      <div className="gallery-wrapper">
        <div>
          <div className="title">
            <h2>Photo Gallery</h2>
            <p>A picture is worth thousand words</p>
            {isOpen && (
              <Modal setIsOpen={setIsOpen} modalContant={modalContant} />
            )}
          </div>
          <div className="input-wrapper">
            <div>
              <label htmlFor="my-file-input">
                <div className="file-input-wrapper">
                  <AiOutlinePlus />
                </div>
              </label>
              <input
                type="file"
                id="my-file-input"
                name="file"
                accept="image/*"
                onChange={handleImage}
              />
            </div>
            <span>
              <p>{selectedFile}</p>
            </span>
            <div className="progress-bar">
              {/* <label htmlFor="file">Uploading progress:</label> */}
              <progress id="file" value={progress} max="100">
                82%
              </progress>
            </div>
          </div>
        </div>
        <div className="img-container">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="image"
              onClick={() => handleImageView(item.fileName)}>
              <img
                src={`http://localhost:3008/images/${item.fileName}`}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
