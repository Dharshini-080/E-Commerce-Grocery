async function ImagetoBase64(file) {
    // Check if the file parameter is a Blob object
    if (!(file instanceof Blob)) {
        throw new Error("Parameter is not a Blob object");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export { ImagetoBase64 };
