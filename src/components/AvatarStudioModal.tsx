import React from 'react';

interface AvatarStudioModalProps {
  onClose: () => void;
  onSave: (url: string) => void;
}

export const AvatarStudioModal: React.FC<AvatarStudioModalProps> = ({ onClose, onSave }) => {
  const handleIframeMessage = (event: MessageEvent) => {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (data?.source === 'readyplayerme' && data?.eventName === 'v1.avatar.exported') {
        onSave(data.data.url);
        onClose();
      }
    } catch (e) {
      // Ignore non-JSON frame events
    }
  };

  React.useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>✨</span> 3D Avatar Creator (Gender, Clothes & Shoes)
          </h3>
          <button
            onClick={onClose}
            className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition"
          >
            Close
          </button>
        </div>
        <iframe
          src="https://demo.readyplayer.me/avatar?frameApi&clearCache&selectBodyType=true"
          className="w-full h-full border-0"
          allow="camera *; microphone *"
        />
      </div>
    </div>
  );
};
