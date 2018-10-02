import { DEFAULT_SETTINGS, RDF_NAMESPACE } from '../../constants/project';
import { getProjectSettings } from '../../utils/iiifSaver';

const createNewManifest = (manifestDomain, audioUri, duration) => ({
  label: {
    en: ['Unnamed manifest'],
  },
  summary: {
    en: ['Description of manifest'],
  },
  type: 'Manifest',
  id: `${manifestDomain}/manifest`,
  items: [
    {
      label: {
        en: ['Untitled Item'],
      },
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
      items: [
        {
          id: `${manifestDomain}/canvas/c1#t=0,${duration}`,
          type: 'Canvas',
        },
      ],
    },
  ],
  [`${RDF_NAMESPACE}:settings`]: getProjectSettings(DEFAULT_SETTINGS),
  '@context': [
    'http://digirati.com/ns/timeliner',
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
});

export default createNewManifest;
