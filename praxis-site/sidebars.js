module.exports = {
  mainSidebar: [
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
            'reference/design/response-definitions',
            'reference/design/traits',
            'reference/design/doc-generation',
            'reference/design/multipart',
          ]
        },
        {
          type: 'category',
          label: 'Implementation',
          items: [
            'reference/implementation/controllers',
            'reference/implementation/resources',
            'reference/implementation/application',
            'reference/implementation/responses',
            'reference/implementation/request-life-cycle',
            'reference/implementation/multipart',
          ]
        },
        {
          type: 'category',
          label: 'Extensions',
          items: [
            'reference/extensions/intro',
            'reference/extensions/mapper-plugin',
            'reference/extensions/pagination-plugin',
            'reference/extensions/field-selection',
            'reference/extensions/filtering',
            'reference/extensions/rendering',
          ]
        },
        {
          type: 'category',
          label: 'Internals',
          items: [
            'reference/internals/intro',
            'reference/internals/field_selection',
            'reference/internals/field_expansion',
            'reference/internals/mapper_selectors',
            'reference/internals/bootstrapping',
            'reference/internals/handlers',
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