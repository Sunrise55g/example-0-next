import { lusitana } from '@/components/fonts';



export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex h-full w-full flex-row items-center justify-center leading-none text-white-800`}
    >
      <p className="text-[30px]">Example-0</p>
    </div>
  );
}