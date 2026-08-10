import MusicPlayer from "@/components/ui/music-player";

const tracks = [
  {
    title: "Manus Lo-Fi Demo",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663863378982/SCtqWIqDKvtIbhNa.wav",
  },
  {
    title: "Sample Track Two",
    src: "https://file-examples.com/wp-content/storage/2017/11/file_example_WAV_1MG.wav",
  },
];

export default function Demo() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <MusicPlayer tracks={tracks} />
    </div>
  );
}
