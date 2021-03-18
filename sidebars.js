module.exports = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Intro',
      items: [
        'intro/intro',
        'intro/installation'
      ]
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: true,
      items: [
        'gettingStarted/intro', 
        'gettingStarted/designingApiResources',
        'gettingStarted/settingUpOurDB',
        'gettingStarted/implementingReads',
        'gettingStarted/buildingCRUD',                
      ]
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/intro',
        {
          type: 'category',
          label: 'Design',
          items: [
            'reference/design/media-types',
            'reference/design/endpoints',
            'reference/design/actions',
            'reference/design/api-definition',
          ]
        },
        {
          type: 'category',
          label: 'Implementation',
          items: [
            'reference/intro',
          ]
        },
        {
          type: 'category',
          label: 'Internals',
          items: [
            'reference/intro',
          ]
        },
        {
          type: 'category',
          label: 'Extensions',
          items: [
            'reference/intro',
          ]
        },
      ]
    },
  ]  
};



// otherSidebar: {
//   Foobar: ['doc3'],
//   Intro: ['intro/intro'],
//   GettingStarted: ['gettingStarted/gettingStarted', 'doc2', 'doc3'],
//   DesigningApis: ['doc1', 'doc2', 'doc3'],
//   ImplementingApis: ['doc1', 'doc2', 'doc3'],
//   Internals: ['mdx'],
// },