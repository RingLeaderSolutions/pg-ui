declare var appConfig: {
    version: string;
    baseApiUri: string;
    signalRUri: string;
    hierarchyApiUri: string;
    uploadApiUri: string;
    auth0_clientId: string;
    auth0_domain: string;
    auth0_callbackUrl: string;
    auth0_logoutCallbackUrl: string;
    environment_name: string;
  };

declare module 'uikit' {
    const use: (what: any) => void;

    interface ModalOptions {
        /**
         * Allows controls from keyboard (ESC to close)
         * @default true
         * <h2>Possible value</h2>
         * boolean
         */
        keyboard?: boolean;
        /**
         * Allow modal to close automatically when clicking on the modal overlay
         * @default true
         * <h2>Possible value</h2>
         * boolean
         */
        bgclose?: boolean;
        /**
         * Set the height for overflow container to start scrolling
         * @default 150
         * <h2>Possible value</h2>
         * integer
         */
        minScrollHeight?: number;
        /**
         * Vertically center the modal
         * @default false
         * <h2>Possible value</h2>
         * boolean
         */
        center?: boolean;
        /**
         * Close currently opened modals on opening modal
         * @default true
         * <h2>Possible value</h2>
         * boolean
         */
        modal?: boolean;
    }
    /**
     * Create modal dialogs with different styles and transitions
     * Documentation: {@link http://getuikit.org/docs/modal.html}
     *
     * <h2>Events</h2>
     *
     * <table>
     * <tr>
     * <th>Name</th>
     * <th>Parameter</th>
     * <th>Description</th>
     * </tr>
     *
     * <tr>
     * <td><code>show.uk.modal</code></td>
     * <td>event</td>
     * <td>On modal show</td>
     * </tr>
     * <tr>
     * <td><code>hide.uk.modal</code></td>
     * <td>event</td>
     * <td>On modal hide</td>
     * </tr>
     * </table>
     * @example
     * <pre><code>
     * $('.modalSelector').on({
     *     'show.uk.modal': function(){
     *         console.log("Modal is visible.");
     *     },
     *
     *     'hide.uk.modal': function(){
     *         console.log("Element is not visible.");
     *     }
     * });
     * </code></pre>
     */
    interface Modal {
        /**
         * Create a alert dialog
         * @param  message The message to display. Can be Html
         */
        alert(message: string): void;
        /**
         * Create a confirm dialog
         * @param  message The message to display. Can be Html
         * @param  [options={bgclose: true, keyboard: false, modal: false}] The modal options
         */
        confirm(message: string, options?: ModalOptions): Promise<any>;
    }

    const modal: Modal;
}
declare module 'uikit/dist/js/uikit-icons';