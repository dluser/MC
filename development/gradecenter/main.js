$('.ui.accordion').accordion();
$('.ui.search')
  .search({
    apiSettings: {
      url: 'https://help.blackboard.com/search?search={query}'
    },
    fields: {
      results : 'items',
      url     : 'html_url'
    },
    minCharacters : 3
  })
;