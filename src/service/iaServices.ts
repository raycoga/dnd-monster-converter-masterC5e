import axios from "axios";

export const getIATraduccion = async (text: string) => {
  const apiKey = import.meta.env.VITE_APP_GEMINI_API;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  return await axios.post(url,{
    "contents": [
      {
        "parts": [
          {
            "text": `Te pasare un string que tiene el formato de archivo de tipo xml, el cual necesito que traduzcas, no deberas de traducir los textos que se encuentren dentro de las etiquetas: <save></save>, <skill></skill> y <spells></spells> ya que eso influiria en otros aspectos. El string es el siguiente: "${text}". Necesito que lo traduzcas al castellano, sin explicaciones ni ejemplos ni sinonimos, solo haz una traduccion directa, como si fueras google translate`
          }
        ]
      }
    ]
  });
};

export const getIAdata = async (text: string) => {
  const apiKey = import.meta.env.VITE_APP_GEMINI_API;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  return await axios.post(url,{
    "contents": [
      {
        "parts": [
          {
            "text": text
          }
        ]
      }
    ]
  });
};
