import * as project from '../project';

describe('actions/project', () => {
  test('importProject', () => {
    expect(
      project.importDocument({ id: 'https://manifest.json', type: 'Manifest' })
    ).toEqual({
      manifest: { id: 'https://manifest.json', type: 'Manifest' },
      type: 'IMPORT_DOCUMENT',
    });
  });

  test('loadProject', () => {
    expect(project.loadProject({ someState: 'test something' })).toEqual({
      state: { someState: 'test something' },
      type: 'LOAD_PROJECT',
    });
  });

  test('resetDocument', () => {
    expect(project.resetDocument()).toEqual({ type: 'RESET_DOCUMENT' });
  });

  test('setDescription', () => {
    expect(project.setDescription('Some description')).toEqual({
      payload: { description: 'Some description' },
      type: 'SET_DESCRIPTION',
    });
  });

  test('setTitle', () => {
    expect(project.setTitle('Some title')).toEqual({
      payload: { title: 'Some title' },
      type: 'SET_TITLE',
    });
  });

  test('setLanguage', () => {
    expect(project.setLanguage('en-GB')).toEqual({
      payload: { language: 'en-GB' },
      type: 'SET_LANGUAGE',
    });
  });

  test('updateSettings', () => {
    expect(project.updateSettings({ someSetting: true })).toEqual({
      payload: { someSetting: true },
      type: 'UPDATE_SETTINGS',
    });
  });
});
