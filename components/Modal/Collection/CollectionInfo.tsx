import { Dispatch, SetStateAction, useState } from "react";
import {
  faFolder,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import useCollectionStore from "@/store/collections";
import { CollectionIncludingMembersAndLinkCount } from "@/types/global";
import RequiredBadge from "../../RequiredBadge";
import SubmitButton from "@/components/SubmitButton";
import { HexColorPicker } from "react-colorful";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";

type Props = {
  toggleCollectionModal: Function;
  setCollection: Dispatch<
    SetStateAction<CollectionIncludingMembersAndLinkCount>
  >;
  collection: CollectionIncludingMembersAndLinkCount;
  method: "CREATE" | "UPDATE";
};

export default function CollectionInfo({
  toggleCollectionModal,
  setCollection,
  collection,
  method,
}: Props) {
  const [submitLoader, setSubmitLoader] = useState(false);
  const { updateCollection, addCollection } = useCollectionStore();

  const submit = async () => {
    if (!collection) return null;

    setSubmitLoader(true);

    const load = toast.loading(
      method === "UPDATE" ? "Applying..." : "Creating..."
    );

    let response;

    if (method === "CREATE") response = await addCollection(collection);
    else response = await updateCollection(collection);

    toast.dismiss(load);

    if (response.ok) {
      toast.success(
        `Collection ${method === "UPDATE" ? "Saved!" : "Created!"}`
      );
      toggleCollectionModal();
    } else toast.error(response.data as string);

    setSubmitLoader(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:w-[35rem] w-80">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full">
          <p className="text-sm text-sky-700 mb-2">
            Name
            <RequiredBadge />
          </p>
          <div className="flex flex-col gap-3">
            <input
              value={collection.name}
              onChange={(e) =>
                setCollection({ ...collection, name: e.target.value })
              }
              type="text"
              placeholder="e.g. Example Collection"
              className="w-full rounded-md p-3 border-sky-100 border-solid border outline-none focus:border-sky-700 duration-100"
            />
            <div className="color-picker flex justify-between">
              <div className="flex flex-col justify-between items-center w-32">
                <p className="text-sm w-full text-sky-700 mb-2">Icon Color</p>
                <div style={{ color: collection.color }}>
                  <FontAwesomeIcon
                    icon={faFolder}
                    className="w-12 h-12 drop-shadow"
                  />
                </div>
                <div
                  className="py-1 px-2 rounded-md text-xs font-semibold cursor-pointer text-sky-700 hover:bg-slate-200 duration-100"
                  onClick={() =>
                    setCollection({ ...collection, color: "#0ea5e9" })
                  }
                >
                  Reset
                </div>
              </div>
              <HexColorPicker
                color={collection.color}
                onChange={(e) => setCollection({ ...collection, color: e })}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="text-sm text-sky-700 mb-2">Description</p>
          <textarea
            className="w-full h-[11.4rem] resize-none border rounded-md duration-100 bg-white p-3 outline-none border-sky-100 focus:border-sky-700"
            placeholder="The purpose of this Collection..."
            value={collection.description}
            onChange={(e) =>
              setCollection({
                ...collection,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>

      <SubmitButton
        onClick={submit}
        loading={submitLoader}
        label={method === "CREATE" ? "Add" : "Save"}
        icon={method === "CREATE" ? faPlus : faPenToSquare}
        className="mx-auto mt-2"
      />
    </div>
  );
}
