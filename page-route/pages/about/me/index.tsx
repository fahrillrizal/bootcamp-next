// import Image from "next/image"
// import ImgHigh from "@/assets/IMG_7192.HEIC";
// import HeavyComponent from "@/components/HeavyComponent";
import dynamic from "next/dynamic";
import { useState } from "react";

const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  ssr: false,
  loading: () =><p>Loading...</p>
}); 

export default function Me() {
    const [show, setShow] = useState(false)
  return (
    <div>
      <h1>About me Page</h1>
      <button onClick={() => setShow(true)}>Show Component</button>
      {/* <img {...ImgHigh} /> */}
      { show && <HeavyComponent /> }
    </div>
  );
}
