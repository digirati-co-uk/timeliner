import { resolveAvResource } from '../AuthResource';

describe('Auth resource', () => {
  describe('resolveAvResource', () => {
    test('it works with choice bodies', () => {
      const annotation = {
        type: 'Annotation',
        motivation: 'painting',
        target:
          'https://spruce.dlib.indiana.edu/media_objects/c6598f95-5082-4bed-a024-9337f6e68b66/manifest/canvas/1j92g763g#',
        body: {
          type: 'Choice',
          choiceHint: 'user',
          items: [
            {
              id:
                'https://spruce.dlib.indiana.edu/master_files/1j92g763g/auto.m3u8',
              type: 'Sound',
              duration: 187.951,
              label: {
                '@none': ['auto'],
              },
              service: [
                {
                  context: 'http://iiif.io/api/auth/1/context.json',
                  '@id':
                    'https://spruce.dlib.indiana.edu/users/sign_in?login_popup=1',
                  '@type': 'AuthCookieService1',
                  confirmLabel: 'Login',
                  description:
                    'Avalon Application requires that you log in with your account to view this content.',
                  failureDescription:
                    '\u003ca href="http://example.org/policy"\u003eAccess Policy\u003c/a\u003e',
                  failureHeader: 'Authentication Failed',
                  header: 'Please Log In',
                  label: 'Login Required',
                  profile: 'http://iiif.io/api/auth/1/login',
                  service: [
                    {
                      '@id':
                        'https://spruce.dlib.indiana.edu/iiif_auth_token/1j92g763g',
                      '@type': 'AuthTokenService1',
                      profile: 'http://iiif.io/api/auth/1/token',
                    },
                    {
                      '@id': 'https://spruce.dlib.indiana.edu/users/sign_out',
                      '@type': 'AuthLogoutService1',
                      label: 'Log out',
                      profile: 'http://iiif.io/api/auth/1/logout',
                    },
                  ],
                },
              ],
            },
            {
              id:
                'https://spruce.dlib.indiana.edu/master_files/1j92g763g/high.m3u8',
              type: 'Sound',
              duration: 187.951,
              label: {
                '@none': ['high'],
              },
              service: [
                {
                  context: 'http://iiif.io/api/auth/1/context.json',
                  '@id':
                    'https://spruce.dlib.indiana.edu/users/sign_in?login_popup=1',
                  '@type': 'AuthCookieService1',
                  confirmLabel: 'Login',
                  description:
                    'Avalon Application requires that you log in with your account to view this content.',
                  failureDescription:
                    '\u003ca href="http://example.org/policy"\u003eAccess Policy\u003c/a\u003e',
                  failureHeader: 'Authentication Failed',
                  header: 'Please Log In',
                  label: 'Login Required',
                  profile: 'http://iiif.io/api/auth/1/login',
                  service: [
                    {
                      '@id':
                        'https://spruce.dlib.indiana.edu/iiif_auth_token/1j92g763g',
                      '@type': 'AuthTokenService1',
                      profile: 'http://iiif.io/api/auth/1/token',
                    },
                    {
                      '@id': 'https://spruce.dlib.indiana.edu/users/sign_out',
                      '@type': 'AuthLogoutService1',
                      label: 'Log out',
                      profile: 'http://iiif.io/api/auth/1/logout',
                    },
                  ],
                },
              ],
            },
            {
              id:
                'https://spruce.dlib.indiana.edu/master_files/1j92g763g/medium.m3u8',
              type: 'Sound',
              duration: 187.951,
              label: {
                '@none': ['medium'],
              },
              service: [
                {
                  context: 'http://iiif.io/api/auth/1/context.json',
                  '@id':
                    'https://spruce.dlib.indiana.edu/users/sign_in?login_popup=1',
                  '@type': 'AuthCookieService1',
                  confirmLabel: 'Login',
                  description:
                    'Avalon Application requires that you log in with your account to view this content.',
                  failureDescription:
                    '\u003ca href="http://example.org/policy"\u003eAccess Policy\u003c/a\u003e',
                  failureHeader: 'Authentication Failed',
                  header: 'Please Log In',
                  label: 'Login Required',
                  profile: 'http://iiif.io/api/auth/1/login',
                  service: [
                    {
                      '@id':
                        'https://spruce.dlib.indiana.edu/iiif_auth_token/1j92g763g',
                      '@type': 'AuthTokenService1',
                      profile: 'http://iiif.io/api/auth/1/token',
                    },
                    {
                      '@id': 'https://spruce.dlib.indiana.edu/users/sign_out',
                      '@type': 'AuthLogoutService1',
                      label: 'Log out',
                      profile: 'http://iiif.io/api/auth/1/logout',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      expect(resolveAvResource(annotation)).toEqual({
        duration: 187.951,
        id: 'https://spruce.dlib.indiana.edu/master_files/1j92g763g/auto.m3u8',
        label: { '@none': ['auto'] },
        service: [
          {
            '@id':
              'https://spruce.dlib.indiana.edu/users/sign_in?login_popup=1',
            '@type': 'AuthCookieService1',
            confirmLabel: 'Login',
            context: 'http://iiif.io/api/auth/1/context.json',
            description:
              'Avalon Application requires that you log in with your account to view this content.',
            failureDescription:
              '<a href="http://example.org/policy">Access Policy</a>',
            failureHeader: 'Authentication Failed',
            header: 'Please Log In',
            label: 'Login Required',
            profile: 'http://iiif.io/api/auth/1/login',
            service: [
              {
                '@id':
                  'https://spruce.dlib.indiana.edu/iiif_auth_token/1j92g763g',
                '@type': 'AuthTokenService1',
                profile: 'http://iiif.io/api/auth/1/token',
              },
              {
                '@id': 'https://spruce.dlib.indiana.edu/users/sign_out',
                '@type': 'AuthLogoutService1',
                label: 'Log out',
                profile: 'http://iiif.io/api/auth/1/logout',
              },
            ],
          },
        ],
        type: 'Sound',
      });
    });
    test('it works with normal bodies', () => {
      const annotation = {
        id: 'http://digirati.com/iiif/v3/temporary/annot/c1-1',
        type: 'Annotation',
        motivation: 'painting',
        label: {
          en: ['Untitled audio'],
        },
        body: {
          id: 'http://www.dlib.indiana.edu/~jwd/Chopin_nocturne.mp3',
          type: 'Audio',
          duration: 330.73632653061225,
          format: 'audio/mp3',
        },
        target: 'http://digirati.com/iiif/v3/temporary/canvas/c',
      };

      expect(resolveAvResource(annotation)).toEqual({
        id: 'http://www.dlib.indiana.edu/~jwd/Chopin_nocturne.mp3',
        type: 'Audio',
        duration: 330.73632653061225,
        format: 'audio/mp3',
      });
    });
  });
});
