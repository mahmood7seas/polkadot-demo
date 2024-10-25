/** @format */

type Props = {
  src: string;
};

export default function DataTableImage({ src }: Props) {
  return (
    <>
      <picture>
        <img
          className="object-contain w-[60px] h-[60px] rounded-[4px]"
          src={src}
          alt="src"
        />
      </picture>
    </>
  );
}
