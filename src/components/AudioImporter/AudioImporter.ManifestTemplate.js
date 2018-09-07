const createNewManifest = (manifestDomain, audioUri, duration) => ({
  label: {
    en: ['Unnamed manifest'],
  },
  type: 'Manifest',
  id: `${manifestDomain}/manifest`,
  items: [
    {
      label: {
        en: ['Untitled Item'],
      },
      height: 1,
      width: 1,
      type: 'Canvas',
      id: `${manifestDomain}/canvas/c1`,
      items: [
        {
          type: 'AnnotationPage',
          items: [
            {
              id: `${manifestDomain}/annot/c1-1`,
              type: 'Annotation',
              motivation: 'painting',
              label: {
                en: ['Untitled audio'],
              },
              body: {
                id: audioUri,
                type: 'Audio',
                duration: duration,
              },
              target: `${manifestDomain}/canvas/c`,
            },
          ],
          id: `${manifestDomain}/list/c1-ap`,
        },
      ],
    },
  ],
  structures: [
    {
      id: `${manifestDomain}/range/r0`,
      type: 'Range',
      label: { en: ['Unnamed range'] },
      items: [],
    },
  ],
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
});

export default createNewManifest;
