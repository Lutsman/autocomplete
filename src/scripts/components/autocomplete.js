export class Autocomplete {
    constructor(options) {
        this.data = options.data;
        this.getData = options.getData;
        this.searchInput = options.searchInput;
        this.$searchInput = null;
        this.$autocompleteList = null;
        this.$body = null;
        this.formatedData = [];
        this.isWorking = false;
        this.isDestroyed = false;
        this.classNames = {
            list: 'autocomplete-list',
            relative: 'uk-position-relative',
        };
        this.events = {
            init: 'searchAutocomplete:init',
            start: 'searchAutocomplete:start',
            stop: 'searchAutocomplete:stop',
            destroy: 'searchAutocomplete:destroy',
        };

        this.init();
    }

    init() {
        this.preRenderList();
        this.bindElements();
        this.attachHandlers();
        this.formatedData = this.getFormatedData();

        this.isWorking = true;
        this.$searchInput.trigger(this.events.init, {controller: this});
    }

    bindElements() {
        this.$searchInput = $(this.searchInput);
        this.$body = $('body');
    }

    attachHandlers() {
        this.$searchInput.on('input', this.inputChangeHandler);
        this.$autocompleteList.on('click', this.autocompleteChooseHandler);
    }

    detachHandlers() {
        this.$searchInput.off('input', this.inputChangeHandler);
        this.$autocompleteList.off('click', this.autocompleteChooseHandler);
    }

    preRenderList() {
        this.$autocompleteList = $(`<ul class="${this.classNames.list}"></ul>`);
        this.$autocompleteList
            .appendTo('body')
            .hide();
        this.setListPosition();
    }

    renderList(words) {
        const $list = this.$autocompleteList;

        for (const word of words) {
            const listItem = `<li>${word}</li>`;
            $list.append(listItem);
        }
    }

    setListPosition() {
        const inputPos = this.getPosition(this.$searchInput);

        this.$autocompleteList.css({
            top: inputPos.bottom,
            left: inputPos.left,
        });
    }

    showList(time) {
        return new Promise(resolve => {
            this.$body.addClass(this.classNames.relative);
            this.$autocompleteList.fadeIn(time || 200, () => resolve());
        });
    }

    hideList(time) {
        return new Promise(resolve => {
            this.$autocompleteList.fadeOut(time || 200, () => {
                this.$body.removeClass(this.classNames.relative);
                resolve();
            });
        });
    }

    removeList() {
        this.$autocompleteList.remove();
        this.$autocompleteList = null;
    }

    inputChangeHandler = e => {
        const val = e.target.value;
        const purposalWords = this.getPurposalWords(this.formatedData, val);

        if (!purposalWords) return;

        this.renderList(purposalWords);
        this.showList();
    };

    autocompleteChooseHandler = e => {
        const target = e.target;
        const li = target.closest('li')

        if (!li) return;

        this.changeInputValue(li.textContent);
        this.hideList();
    };

    getPosition($el) {
        const box = $el.offset();

        return {
            top: box.top,
            bottom: box.top + $el.height(),
            left: box.left,
            right: box.left + $el.width(),
        };
    }

    getFormatedData() {
        if (this.data) {
            return this.parseData(this.data);
        }

        if (typeof this.getData === 'function') {
            if (typeof this.getData.then === 'function') {
                return this.getData().then(data => this.parseData(data));
            }

            typeof this.parseData(this.getData());
        }

        return null;
    }

    parseData(data) {
        if (Array.isArray((data))) {
            return data;
        }

        if (typeof data === 'string') {
            return data.split(' ');
        }
    }

    removeRepetition(data) {
        let processedData = [...data];

        for (let i = 0; i < processedData.length; i++) {
            let j = i + 1;

            while (j < processedData.length) {
                if (processedData[i] === processedData[j]) {
                    processedData.splice(j, 1);
                    continue;
                }

                j++;
            }
        }

        return processedData;
    }

    getPurposalWords(searchData, searchText) {
        return searchData.filter(data => ~data.indexOf(searchText));
    }

    changeInputValue(val) {
        if (!val) return;

        this.inputValue = val;
        this.$searchInput.val(val);
    }

    start = () => {
        if (this.isWorking) return;

        if (this.isDestroyed) {
            this.preRenderList();
            this.isDestroyed = false;
        }

        this.attachHandlers();
        this.isWorking = true;
        this.$searchInput.trigger(this.events.start, {controller: this});
    }

    stop = () => {
        if (!this.isWorking) return;

        this.isWorking = false;
        this.$searchInput.trigger(this.events.stop, {controller: this});
    }

    destroy = () => {
        if (!this.isWorking) return;

        this.detachHandlers();
        this.hideList(0)
            .then(() => {
                this.removeList();
                this.isWorking = false;
                this.isDestroyed = true;
                this.$searchInput.trigger(this.events.destroy, {controller: this});
            });
    }
}