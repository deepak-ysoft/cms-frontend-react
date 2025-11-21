import React, { memo, useState } from "react";
import { Avatar } from "@mui/material";

function DisplayImage({ imagePath, alt = "User", size = 40 }) {
  const [isError, setIsError] = useState(false);

  // ✅ Construct full image URL only if imagePath exists
  const imageSrc = imagePath ? `/${imagePath.replace(/^\//, "")}` : null;

  return (
    <Avatar
      key={imageSrc}
      src={!isError && imageSrc ? imageSrc : undefined} // ✅ Only set if no error
      alt={alt}
      sx={{ width: size, height: size }}
      onError={() => setIsError(true)} // ✅ Handle broken image gracefully
    ></Avatar>
  );
}

export default memo(DisplayImage);
