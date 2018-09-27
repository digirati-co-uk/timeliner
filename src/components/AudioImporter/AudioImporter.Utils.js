import createNewManifest from './AudioImporter.ManifestTemplate';

const MANIFEST_DOMAIN = 'http://digirati.com/iiif/v3/temporary';

// TODO: check if it is valid
// throws 'Invalid manifest'
const validateManifest = manifest => true;

const importResource = url => {
  return new Promise((resolve, reject) => {
    fetch(url, { mode: 'no-cors' })
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (!contentType) {
          throw `Invalid Content Type ${contentType}`;
        }
        if (contentType.startsWith('audio/')) {
          const audio = new Audio();
          const audioURL = url;
          audio.addEventListener('loadedmetadata', () => {
            resolve(
              createNewManifest(MANIFEST_DOMAIN, audioURL, audio.duration)
            );
          });
          audio.addEventListener('error', () => {
            switch (audio.error.code) {
              case 1:
                throw 'fetching process aborted by user';
                break;
              case 2:
                throw 'error occurred when downloading';
                break;
              case 3:
                throw 'error occurred when decoding';
                break;
              case 4:
                throw 'audio not supported';
                break;
              default:
                throw 'undetermined audio error';
                break;
            }
          });
          audio.src = audioURL;
        } else if (contentType.includes('application/json')) {
          const manifestJSON = res.json();
          validateManifest(manifestJSON);
          resolve(manifestJSON);
        } else {
          throw `Content type not recognised ${contentType}`;
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default importResource;
