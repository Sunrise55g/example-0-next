import { lusitana } from '@/components/fonts';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-gray-800`}
    >
      <p className="text-[44px]">Example-0</p>
    </div>
  );
}
