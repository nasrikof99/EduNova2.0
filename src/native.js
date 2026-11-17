import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SpeechRecognition } from '@capgo/capacitor-speech-recognition';

const isNative = Capacitor.isNativePlatform();
let speechListener = null;
window.EduNovaNative = {
  isNative,
  async read() {
    if (!isNative) return null;
    try { const result=await Filesystem.readFile({path:'EduNova/data.json',directory:Directory.Data,encoding:Encoding.UTF8}); return JSON.parse(result.data); }
    catch {return null;}
  },
  async write(value) {
    if (!isNative) return;
    await Filesystem.writeFile({path:'EduNova/data.json',data:JSON.stringify(value),directory:Directory.Data,encoding:Encoding.UTF8,recursive:true});
  },
  async shareFile(filename, content, mime) {
    if (!isNative) return false;
    const path = 'exports/' + filename.replace(/[^a-zA-Z0-9._-]/g,'_');
    await Filesystem.writeFile({path,data:content,directory:Directory.Cache,encoding:Encoding.UTF8,recursive:true});
    const result=await Filesystem.getUri({path,directory:Directory.Cache});
    await Share.share({title:'EduNova',url:result.uri,dialogTitle:'Kongsi daripada EduNova'});
    return true;
  },
  async notify(id,title,body,when) {
    if(!isNative) return false;
    const check=await LocalNotifications.checkPermissions();
    if(check.display!=='granted') {
      const asked=await LocalNotifications.requestPermissions();
      if(asked.display!=='granted') return false;
    }
    await LocalNotifications.schedule({notifications:[{id,title,body,schedule:{at:new Date(when)},}]});
    return true;
  },
  async cancelNotify(id){ if(isNative) await LocalNotifications.cancel({notifications:[{id}]}); },
  async enableExactAlarms(){
    if(!isNative)return false;
    const state=await LocalNotifications.checkExactNotificationSetting();
    if(state.exact_alarm==='granted')return true;
    await LocalNotifications.changeExactNotificationSetting();
    return false;
  },
  async startSpeech(lang, onPartial) {
    if(!isNative) return false;
    const permission=await SpeechRecognition.requestPermissions();
    if(permission.speechRecognition!=='granted') throw new Error('Kebenaran mikrofon tidak diberikan.');
    const result=await SpeechRecognition.available();
    if(!result.available) throw new Error('Pengecaman suara tidak disokong pada peranti ini.');
    if(speechListener) await speechListener.remove();
    speechListener=await SpeechRecognition.addListener('partialResults', ev => onPartial(ev.matches?.[0] || ''));
    SpeechRecognition.start({language:lang,partialResults:true,popup:false,maxResults:1}).then(ev=>{
      if(ev?.matches?.[0]) onPartial(ev.matches[0]);
    }).catch(err=>console.warn('Speech recognition:',err));
    return true;
  },
  async stopSpeech(){ if(!isNative)return;try{await SpeechRecognition.stop();}catch{} if(speechListener){await speechListener.remove();speechListener=null;} }
};
const script=document.createElement('script');
script.src='./app.js';
script.defer=true;
document.body.appendChild(script);
