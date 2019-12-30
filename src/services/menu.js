export async function getLeftMenuData() {
  return [
    {
      title: 'Theme Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      divider: true,
    },
    {
      title: 'Dashboard',
      key: 'dashboardAlpha',
      url: '/dashboard/',
      icon: 'icmn icmn-home',
    },
    {
      divider: true,
    },
    {
      title: 'Campaign',
      key: 'emmCampaign',
      icon: 'icmn icmn-bullhorn',
      children: [
        {
          title: 'Newsletter',
          key: 'newsletterManagement',
          url: '/newsletter',
        },
        {
          title: 'Automation',
          key: 'automatedCampaignManagement',
          url: '/automated-campaign/create',
        },
        {
          title: 'Campaign',
          key: 'campaignEvent',
          url: '/campaign/home',
        },
      ],
    },
    {
      divider: true,
    },
    {
      title: 'Subscriber',
      key: 'subscriber',
      icon: 'icmn icmn-users',
      children: [
        {
          title: 'View subscribers',
          key: 'viewSubscribers',
          url: '/subscriber/subscribers',
        },
        {
          title: 'Audiences',
          key: 'audiences',
          url: '/subscriber/audiences',
        },
      ],
    },
    {
      divider: true,
    },
    {
      title: 'Email Flow',
      key: 'emailflow',
      icon: 'icmn icmn-tree',
      url: '/emailflow',
    },
    {
      divider: true,
    },
    // {
    //   title: 'Utilities',
    //   key: 'utilities',
    //   icon: 'icmn icmn-briefcase',
    //   children: [
    //     {
    //       title: 'Gallery',
    //       key: 'gallery',
    //       icon: 'icmn icmn-images',
    //       url: '/util/gallery',
    //     },
    //     {
    //       title: 'Email Templates',
    //       key: 'emailTemplates',
    //       icon: 'icmn icmn-file-text',
    //       url: '/util/email-templates',
    //     },
    //   ],
    // },
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Theme Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Dashboard',
      key: 'dashboardAlpha',
      url: '/dashboard/',
      icon: 'icmn icmn-home',
    },
    {
      title: 'Campaign',
      key: 'emmCampaign',
      icon: 'icmn icmn-bullhorn',
      url: '/campaign',
    },
    {
      title: 'Customer',
      key: 'customer',
      icon: 'icmn icmn-users',
      children: [
        {
          title: 'View subscribers',
          key: 'viewsubscriber',
          url: '/subscriber/subscribers',
        },
        {
          title: 'Audience',
          key: 'Audience',
          url: '/subscriber/audiences',
        },
      ],
    },
    {
      title: 'Email Flow',
      key: 'flow',
      icon: 'icmn icmn-tree',
      url: '/emailflow',
    },
    // {
    //   title: 'Utilities',
    //   key: 'utilities',
    //   children: [
    //     {
    //       title: 'Gallery',
    //       key: 'gallery',
    //       icon: 'icmn icmn-images',
    //       url: '/util/gallery',
    //     },
    //     {
    //       title: 'Email Templates',
    //       key: 'emailTemplates',
    //       icon: 'icmn icmn-file-text',
    //       url: '/util/email-templates',
    //     },
    //   ],
    // },
  ]
}
