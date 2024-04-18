import SubmitButton from "./SubmitButton";

type MessageFormProps = {
  loading: boolean;
  caption: string;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
  edit: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sendImageAction: Function;
  updateConvo: () => void;
};

/**
 * Renders a form for sending messages.
 *
 * @param loading - Indicates whether the form is in a loading state.
 * @param sendImageAction - The action to be triggered when the form is submitted.
 * @param setCaption - Callback function to update the caption value.
 * @param caption - The current value of the caption input field.
 * @param edit - Indicates whether the form is in edit mode.
 */
export const MessageForm = ({
  loading,
  setCaption,
  edit,
  caption,
  sendImageAction,
  updateConvo,
}: MessageFormProps) => {
  return (
    <form
      onSubmit={async (e) => {
        sendImageAction(e);
      }}
      className="grid grid-flow-col align-middle place-items-center justify-between bg-neutral-200 dark:bg-neutral-800 rounded-lg max-w-md mx-auto"
    >
      <input
        id="message"
        name="message"
        disabled={loading}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        autoCorrect="true"
        autoComplete="off"
        className={`font-normal transition-all duration-300 resiL-none leading-4 text-xs md:text-sm antialiased focus:outline-none col-span-10 w-full h-fit p-3 bg-neutral-200 dark:bg-neutral-800 outline-none rounded-l-lg disabled:cursor-not-allowed disabled:bg-opacity-50`}
        placeholder="Caption (optional)"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />
      <SubmitButton updateConvo={updateConvo} edit={edit} pending={loading} />
    </form>
  );
};
