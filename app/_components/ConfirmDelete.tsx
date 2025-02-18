import Button from "./Button";

type ConfirmDelteProps = {
  resourceName: string;
  onConfirm: () => void;
  disabled?: boolean;
  onCloseModal?: () => void;
};

function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
}: ConfirmDelteProps) {
  return (
    <div className="xs:w-[30rem] mx-[1rem] flex w-[22rem] flex-col gap-[1.2rem] bg-primary-800 px-6 text-primary-100 sm:mx-0 sm:w-[25rem]">
      <h3 className="text-3xl">Delete {resourceName}</h3>
      <p className="mb-[1rem]">
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div className="flex justify-end gap-[1.2rem] text-center">
        <Button
          ariaLabel="Cancel"
          variation="primary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button
          ariaLabel="Delete"
          variation="danger"
          disabled={disabled}
          onClick={() => {
            onConfirm();
            onCloseModal?.();
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
