type DigitalProduct = {
    name: string;
    type: string;
    fileExtension: string;
};

export const ProductTypes: DigitalProduct[] = [
    { name: "PDF", type: "PDF", fileExtension: ".pdf" },
    { name: "Video Course", type: "MP4", fileExtension: ".mp4" },
    { name: "Audio Book", type: "MP3", fileExtension: ".mp3" },
    { name: "Presentation", type: "PowerPoint", fileExtension: ".pptx" },
    { name: "Spreadsheet", type: "Excel", fileExtension: ".xlsx" },
    { name: "eBook (ePub)", type: "ePub", fileExtension: ".epub" },
    { name: "Image Asset", type: "PNG", fileExtension: ".png" },
    { name: "Source Code", type: "ZIP", fileExtension: ".zip" },
    { name: "Software", type: "EXE", fileExtension: ".exe" },
    { name: "Document", type: "Word", fileExtension: ".docx" },
    { name: "Tutorial", type: "YouTube Video", fileExtension: "URL" },
    { name: "Database", type: "SQL", fileExtension: ".sql" },
    { name: "3D Model", type: "OBJ", fileExtension: ".obj" },
    { name: "Font File", type: "TTF", fileExtension: ".ttf" },
];

