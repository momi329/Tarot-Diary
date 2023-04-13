declare module "quill-emoji" {
  import Quill from "quill";

  interface EmojiOptions {
    position: string;
    set: any;
    sheetSize: number;
    tooltip: boolean;
  }

  class EmojiBlot extends Quill.Embed {
    static create(value: any): any;
    static value(domNode: any): any;
    static blotName: string;
    static className: string;
  }

  class Emoji {
    constructor(quill: Quill, options: EmojiOptions);
    private quill;
    private options;
    private toolbar;
    private container;
    private list;
    private atValues;
    private emojiValues;
    private searchValues;
    private atwho;
    private isAt;
    private isEmoji;
    private isSearch;
    private ignoreFocus;
    private ignoreUpdate;
    private ignoreClick;
    private ignoreBlur;
    private atIndex;
    private atLeft;
    private atTop;
    private active;
    private itemIndex;
    private labelIndex;
    private charIndex;
    private toolbarHeight;
    private searchPattern;
    private searchResults;
    private tooltipIndex;
    private onAtMatch;
    private onEmojiMatch;
    private onSearchMatch;
    private buildAtList;
    private buildEmojiList;
    private buildSearchList;
    private updateList;
    private buildSearch;
    private buildPicker;
    private buildTooltip;
    private showTooltip;
    private hideTooltip;
    private showList;
    private hideList;
    private setPosition;
    private restoreFocus;
    private bindAt;
    private bindEmoji;
    private bindSearch;
    private bindToolbar;
    private bindContainer;
    private bindListeners;
    private unbindListeners;
    private handleClick;
    private handleBlur;
    private handleFocus;
    private handleKeydown;
    private handleKeyup;
    private handleMouseover;
    private handleMouseleave;
    private handleWindowResize;
    private handleWindowClick;
    private handleContainerScroll;
    private handleEditorScroll;
    private destroy;
  }

  export default Emoji;
}
declare module "quill" {
  interface Quill {
    getModule(moduleName: string): any;
  }
}
