import {Autocomplete} from './autocomplete/autocomplete';
import './autocomplete/autocomplete.less';

$(() => {
    const $input = $('.search-input');
    const options = {
        searchInput: $input,
        getData: () => $('.search-text').text(),
    };
    const searchAutocomplete = new Autocomplete(options);
    const $startBtn = $('.start-btn');
    const $stopBtn = $('.stop-btn');
    const $destroyBtn = $('.destroy-btn');

    $startBtn.on('click', searchAutocomplete.start);
    $stopBtn.on('click', searchAutocomplete.stop);
    $destroyBtn.on('click', searchAutocomplete.destroy);

    $input.on({
        'searchAutocomplete:init': () => console.log('init'),
        'searchAutocomplete:start': () => console.log('start'),
        'searchAutocomplete:stop': () => console.log('stop'),
        'searchAutocomplete:destroy': () => console.log('destroy'),
    });
});