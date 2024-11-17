import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent } from "./ui/dialog"
import { useState, useEffect } from "react"
import type { WavRecorder, WavStreamPlayer } from "wavtools"

interface AudioDeviceControlsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wavRecorderRef: React.RefObject<WavRecorder>;
  wavStreamPlayerRef: React.RefObject<WavStreamPlayer>;
  isMuted: boolean;
  realtimeClient: any; // RealtimeClient type
}

interface AudioDevice extends MediaDeviceInfo {
  default?: boolean;
}

export function AudioDeviceControls({ 
  open,
  onOpenChange,
  wavRecorderRef,
  wavStreamPlayerRef,
  isMuted,
  realtimeClient
}: AudioDeviceControlsProps) {
  const [microphones, setMicrophones] = useState<AudioDevice[]>([])
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([])
  const [selectedMic, setSelectedMic] = useState<string>("")
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("")

  const getCurrentDevices = async () => {
    try {
      const mics = await wavRecorderRef.current?.listDevices() || [];
      setMicrophones(mics);

      const currentMic = wavRecorderRef.current?.stream?.getAudioTracks()[0]?.getSettings()?.deviceId;
      if (currentMic) {
        setSelectedMic(currentMic);
      } else {
        const defaultMic = mics.find(mic => mic.default);
        if (defaultMic) setSelectedMic(defaultMic.deviceId);
        else if (mics.length) setSelectedMic(mics[0].deviceId);
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const spks = devices.filter(device => device.kind === 'audiooutput');
      setSpeakers(spks);

      const audioContext = (wavStreamPlayerRef.current as any)?.context;
      const currentSpeaker = audioContext?.sinkId || (audioContext?.destination as any)?.sinkId;
      if (currentSpeaker) {
        setSelectedSpeaker(currentSpeaker);
      } else {
        const defaultSpk = spks.find(spk => spk.deviceId === 'default');
        if (defaultSpk) setSelectedSpeaker(defaultSpk.deviceId);
        else if (spks.length) setSelectedSpeaker(spks[0].deviceId);
      }
    } catch (error) {
      console.error('Error accessing audio devices:', error);
    }
  };

  useEffect(() => {
    if (open) {
      getCurrentDevices();
    }

    const handleDeviceChange = async () => {
      await getCurrentDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [open]);

  const handleMicChange = async (deviceId: string) => {
    try {
      setSelectedMic(deviceId);
      
      const wasRecording = wavRecorderRef.current?.recording;
      
      // End current recording if active
      if (wavRecorderRef.current?.getStatus() !== 'ended') {
        await wavRecorderRef.current?.end();
      }
      
      // Start new recording with selected device
      await wavRecorderRef.current?.begin(deviceId);

      // If we were recording and not muted, resume recording and streaming
      if (wasRecording && !isMuted) {
        await wavRecorderRef.current?.record((data: { mono: ArrayBuffer }) => {
          if (realtimeClient?.isConnected?.() && !isMuted) {
            realtimeClient.appendInputAudio(data.mono);
          }
        });
      }
    } catch (error) {
      console.error('Error changing microphone:', error);
    }
  };

  const handleSpeakerChange = async (deviceId: string) => {
    try {
      setSelectedSpeaker(deviceId);
      
      if (wavStreamPlayerRef.current) {
        const audioContext = (wavStreamPlayerRef.current as any).context;
        
        if (audioContext?.setSinkId) {
          await audioContext.setSinkId(deviceId);
        } else if ((audioContext?.destination as any)?.setSinkId) {
          await (audioContext.destination as any).setSinkId(deviceId);
        }
      }
    } catch (error) {
      console.error('Error changing speaker:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px] p-0 bg-background border-border">
        <div className="flex gap-2 p-4">
          <Select value={selectedMic} onValueChange={handleMicChange}>
            <SelectTrigger className="w-[180px] bg-background border-input">
              <SelectValue placeholder="Select Microphone" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {microphones.map((mic) => (
                <SelectItem 
                  key={mic.deviceId} 
                  value={mic.deviceId}
                  className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {mic.label || `Microphone ${mic.deviceId.slice(0, 4)}`}
                  {mic.default ? ' (Default)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSpeaker} onValueChange={handleSpeakerChange}>
            <SelectTrigger className="w-[180px] bg-background border-input">
              <SelectValue placeholder="Select Speaker" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {speakers.map((speaker) => (
                <SelectItem 
                  key={speaker.deviceId} 
                  value={speaker.deviceId}
                  className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {speaker.label || `Speaker ${speaker.deviceId.slice(0, 4)}`}
                  {speaker.deviceId === 'default' ? ' (Default)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  )
} 