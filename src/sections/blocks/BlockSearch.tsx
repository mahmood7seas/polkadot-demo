/** @format */

import { FormEvent, useState } from "react";
import { InputField } from "../../components";
import { BlockDetails } from "./BlockDetails";

const BlockSearch = () => {
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOpenModal(true);
  };

  return (
    <div className="max-w-[700px] m-auto">
      <form
        onSubmit={submit}
        className="bg-[#D9D9D90A] space-y-3 p-5 rounded-2xl overflow-x-auto"
      >
        <InputField
          type="number"
          onChange={(e) => setSelectedBlock(+e.target.value)}
          name="block"
          label="search for block"
          placeholder="enter block number"
          required
        />
        <button
          type="submit"
          className=" px-5 py-2 rounded bg-white text-primary font-bold"
        >
          submit
        </button>
      </form>
      <BlockDetails
        openModal={openModal}
        selectedBlock={selectedBlock}
        setOpenModal={setOpenModal}
        setSelectedBlock={setSelectedBlock}
      />
    </div>
  );
};

export { BlockSearch };
