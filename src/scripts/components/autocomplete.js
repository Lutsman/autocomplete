class Autocomplete {
    constructor(options) {
        this.getDataFunc = options.data;
        this.searchInput = options.searchInput;
        this.$searchInput;
        this.inputValue = '';
        this.formatedData;

        this.init();
    }

    init() {
        this.bindElements();
        this.attachHandlers();
        this.formatedData = this.getData();
    }

    bindElements() {
        this.$searchInput = $(this.searchInput);
    }

    attachHandlers() {
        this.$searchInput.on('input', this.inputHandler);
    }

    renderList() {

    }

    getData() {
        return this.getDataFunc().then(data => this.parseData(data));
    }

    inputHandler = e => {

    };

    parseData(data) {
        return data;
    }

    getLastWord() {
        const words = this.inputValue.split(' ');
        const len = words.length;

        if (len === 1 && !!words[0]) {
            return words[0];
        }

        if (len > 1 && !!words[len - 1]) {
            return words[len -1];
        }

        return null;
    }

    getPurposalWords(searchData, word) {

    }
}