
export enum HelpTextKey {
    ADD_ITEM,
    CLEAR,
    DEFAULT,
    EXAMPLE_ITEMS,
    RESET,
    SAVE_SHARE,
    SETTINGS,
    TRASH
}

type HelpTextParams = {
    helpTextKey: HelpTextKey | null;
}

export function HelpText({helpTextKey}: HelpTextParams) {
    return(
        <>
        {(() => {
            switch (helpTextKey) {
                case HelpTextKey.ADD_ITEM:
                    return (
                        <p>Items over 35 characters will be trimmed. <span className="text-success">TIP:Paste a comma separated list for quick entry.</span></p>
                    )
                case HelpTextKey.CLEAR:
                    return (
                        <p>Clear all items from the matrix AND the item bank. <span className="text-danger">DANGER:This cannot be undone!</span></p>
                    )
                case HelpTextKey.EXAMPLE_ITEMS:
                    return (
                        <p>Add some example items to the item bank.</p>
                    )
                case HelpTextKey.RESET:
                    return (
                        <p>Move all items from the matrix back to the item bank. <span className="text-danger">DANGER:This cannot be undone!</span></p>
                    )
                case HelpTextKey.SAVE_SHARE:
                    return (
                        <p>Save the state of your matrix and share it with others.</p>
                    )
                case HelpTextKey.SETTINGS:
                    return (
                        <p>Make changes to the matrix.</p>
                    )
                case HelpTextKey.TRASH:
                    return (
                        <p>Drag items into the trash can to delete them.</p>
                    )
                default:
                    return <p>Drag and drop the items from the item bank into the matrix.</p>
            }
          })()}
          </>
    );
}