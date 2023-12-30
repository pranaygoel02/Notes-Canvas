import React, { useState, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { canvasAtom, selectedAtom } from "@/hooks/useCanavas";
import useSwr from "swr";
import regeneratorRuntime from "regenerator-runtime";
import Logo from "../../assets/images/logo.png";
import { nanoid } from "nanoid";
import {RiVoiceprintFill} from 'react-icons/ri'
import {AiFillDelete} from 'react-icons/ai'
import {BsFillMicFill} from 'react-icons/bs'
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import Image from "next/image";


const appId = process.env.NEXT_PUBLIC_SPEECHLY_APP_ID;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

function Sidepanel() {
  const colorRef = useRef(null);
  const bgRef = useRef(null);
  const borderRef = useRef(null);

  const [canvasItems, setCanvasItems] = useAtom(canvasAtom);
  const [selectedItem, setSelectedItem] = useAtom(selectedAtom);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState("#000000");
  const [selectedBorderColor, setSelectedBorderColor] = useState("#000000");
  const [oldText, setOldText] = useState('')
  const [newTranscript, setNewTranscript] = useState('')
  // const [listening, setListening] = useState(false)
  
  // const [selectedFont, setSelectedFont] = useState('Roboto')

  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if(selectedItem) {
      setNewTranscript(transcript)
    }
  }, [transcript])

  useEffect(() => {
    if(selectedItem) {
      selectedItem.value = oldText + ' ' + newTranscript
      setSelectedItem(selectedItem)
    }
  }, [newTranscript])

  useEffect(() => {
    if(selectedItem) {
      setOldText(selectedItem.value)
    }
  }, [listening, selectedItem])


  const addTextToCanvas = (e) => {
    e.preventDefault();
    setCanvasItems([
      ...canvasItems,
      <textarea
        className="p-4 border-2 border-dashed outline-none resize bg-[#ffea00] shadow-md"
        id={nanoid()}
        onClick={(e) => {
          e.preventDefault();
          console.log(e.target);
          setSelectedItem(e.target);
        }}
        placeholder="Add your note here"
      ></textarea>,
    ]);
  };
  console.log("Selected", selectedItem?.style.color);

  let synth, recognition;

   if (typeof window !== 'undefined') {
    synth = window.speechSynthesis;
   }

  const handleSpeech = (e) => {
    e.preventDefault();
    console.log(selectedItem.value);
    const utterThis = new SpeechSynthesisUtterance(selectedItem?.value);
    console.log(utterThis);
    synth.speak(utterThis);
  };

  // useEffect(() => {
  //   handleListen()
  // },[listening])

  // const handleListen = () => {
  //   if(listening) {
  //     console.log('if');
  //     recognition.start()
  //     recognition.onend = () => {
  //       console.log('continue..');
  //       recognition.start();
  //     }
  //   }
  //   else {
  //     console.log('else');
  //     recognition.stop()
  //     recognition.onend = () => {
  //       console.log('Stopped listening on click');
  //     }
  //   }
  //   console.log('handleListen');
  //   recognition.onstart = () => {
  //     console.log('Listening!');
  //   }

  //   recognition.onresult = (e) => {
  //     console.log('Res:',e);
  //     const transcript = Array.from(e.results).map(res => res[0]).map(res => res.transcript).join('')
  //     console.log(transcript);
  //     recognition.onerror = e => {
  //       console.log(e.error);
  //     }
  //     selectedItem.value = transcript
  //     setSelectedItem(selectedItem)
  //   }
  // }

  return (
    <div className="p-4 bg-[#222222] overflow-y-auto overflow-x-hidden h-screen text-white flex flex-col gap-4">
      <Image className="w-16 self-center" src={Logo}/>
      <button title="Add a new note" onClick={addTextToCanvas} className="p-4 border-2 border-dashed">
        Text
      </button>
      <button title="Add an image" className="p-4 border-2 border-dashed">Image</button>
      <div className="grid grid-cols-2 gap-3">
        <input
          ref={colorRef}
          className="hidden"
          type={"color"}
          value={selectedItem?.style?.color}
          onChange={(e) => {
            selectedItem.style.color = e.target.value;
            setSelectedItem(selectedItem);
            setSelectedColor(e.target.value);
          }}
        />
        
        <button
          title="Text Color"
          onClick={() => {
            colorRef.current.click();
          }}
          className="p-4 aspect-square w-4 h-4 flex items-center justify-center outline outline-1 rounded"
          style={{ background: `${selectedItem?.style.color || selectedColor}` }}
        >
          A
        </button>
        <button
          title="Bold"
          onClick={(e) => {
            selectedItem.classList.toggle("font-bold");
            e.target.classList.toggle("bg-white");
            e.target.classList.toggle("text-black");
            console.log(selectedItem.classList);
          }}
          className={`p-4 aspect-square w-4 h-4 flex items-center justify-center outline outline-1 rounded ${selectedItem?.classList?.value.includes("font-bold") ? "bg-white text-black" : ""}`}
        >
          B
        </button>
        <button
          title="Italic"
          onClick={(e) => {
            selectedItem.classList.toggle("italic");
            e.target.classList.toggle("bg-white");
            e.target.classList.toggle("text-black");
          }}
          className={`p-4 aspect-square w-4 h-4 flex items-center justify-center outline outline-1 rounded italic ${selectedItem?.classList?.value.includes("italic") ? "bg-white text-black" : ""}`}
        >
          I
        </button>
        <button
          title="Underline"
          onClick={(e) => {
            selectedItem.classList.toggle("underline");
            e.target.classList.toggle("bg-white");
            e.target.classList.toggle("text-black");
          }}
          className={`p-4 aspect-square w-4 h-4 flex items-center justify-center outline outline-1 rounded underline ${selectedItem?.classList?.value.includes("underline") ? "bg-white text-black" : ""}`}
        >
          U
        </button>
        <input
           title="Top Left Radius"
            onChange={(e) => {
                selectedItem.style.borderTopLeftRadius = `${e.target.value}px`
                setSelectedItem(selectedItem)
            }}
          className={`aspect-square p-1 w-8 flex items-center justify-center outline outline-1 outline-white rounded-tl-xl text-white focus:outline-none text-xs text-center`}
        />
        <input
        title="Top Right Radius"
        onChange={(e) => {
            selectedItem.style.borderTopRightRadius = `${e.target.value}px`
            setSelectedItem(selectedItem)
        }}
          className={`aspect-square p-1 w-8 flex items-center justify-center outline outline-1 outline-white rounded-tr-xl text-white focus:outline-none text-xs text-center`}
        />
        <input
        title="Bottom Left Radius"
        onChange={(e) => {
            selectedItem.style.borderBottomLeftRadius = `${e.target.value}px`
            setSelectedItem(selectedItem)
        }}
          className={`aspect-square p-1 w-8 flex items-center justify-center outline outline-1 outline-white rounded-bl-xl text-white focus:outline-none text-xs text-center`}
        />
        <input
        title="Bottom Right Radius"
        onChange={(e) => {
            selectedItem.style.borderBottomRightRadius = `${e.target.value}px`
            setSelectedItem(selectedItem)
        }}
          className={`aspect-square p-1 w-8 flex items-center justify-center outline outline-1 outline-white rounded-br-xl text-white focus:outline-none text-xs text-center`}
        />
        <input
         title="Background Color"
          ref={bgRef}
          className="hidden"
          type={"color"}
          value={selectedItem?.style?.background}
          onChange={(e) => {
            selectedItem.style.background = e.target.value;
            setSelectedItem(selectedItem);
            setSelectedBgColor(e.target.value);
          }}
        />
        <button
          title="Background Color"
          onClick={() => {
            bgRef.current.click();
          }}
          className="p-4 aspect-square w-4 h-4 flex items-center justify-center outline outline-1 rounded"
          style={{ background: `${selectedItem?.style.color || selectedBgColor}` }}
        >
        </button>
       
        <div title="Font Size" className="flex-col flex outline outline-1 outline-white rounded text-white focus:outline-none text-xs text-center">
        <input
          className={`p-1 w-8 flex items-center justify-center text-white text-center`}
          onChange={(e) => {
            selectedItem.style.fontSize = `${e.target.value}px`;
            setSelectedItem(selectedItem);
          }}
        />
        <p className="bg-white text-[0.5rem] p-[0.1rem] text-black">A</p>
        </div>
        <div title="Padding" className="flex-col flex outline outline-1 outline-white rounded text-white focus:outline-none text-xs text-center">
        <input
          className={`p-1 w-8 flex items-center justify-center text-white text-center`}
          onChange={(e) => {
            selectedItem.style.padding = `${e.target.value}px`;
            setSelectedItem(selectedItem);
          }}
        />
        <p className="bg-white text-[0.5rem] p-[0.1rem] text-black">Padding</p>
        </div>
        <button
          title="Delete"
          onClick={() => {
            setCanvasItems(canvasItems.filter((item) => {
              console.log(item, selectedItem);
              return  item.props.id !== selectedItem.id
            }));
          }}
          className="p-2 aspect-square flex items-center justify-center outline outline-1 rounded text-white text-2xl"
        >
          <AiFillDelete/>
        </button>
        <button onClick={handleSpeech} className="p-2 aspect-square flex items-center justify-center outline outline-1 rounded text-white text-2xl">
          <RiVoiceprintFill className=""/>
        </button>
        <button onClick={()=>listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening() } className={`p-2 aspect-square flex items-center justify-center outline outline-1 rounded text-2xl ${listening ? 'bg-white text-black' : 'text-white'}`}>
          <BsFillMicFill className=""/>
        </button>
      </div>
    </div>
  );
}

export default Sidepanel;

{
  /* <select className='text-black' onChange={async (e)=>{
                    console.log('chage', e.target.value);
                    const myFont = new FontFace(e.target.name, `url(${e.target.value})`)
                    await myFont.load()
                    document.fonts.add(myFont)
                    console.log(document.fonts);
                    selectedItem.style.fontFamily = e.target.name
                    console.log(selectedItem);
                    setSelectedItem(selectedItem)
                }}>
                {data?.items?.map((item, index) => 
                    item.variants.map(variant => <option name={`${item.family}-${variant}`} value={item.files[variant]}>{item.family} {variant}</option>)
                )}
            </select>             */
}
