import assert from 'assert';
import sinon from 'sinon';
import mongoose from 'mongoose';

describe('DB module (db.js)', () => {
  let connectStub;
  let onStub;
  let processOnStub;
  let processOnceStub;
  let consoleLogStub;
  let consoleErrorStub;
  let originalNodeEnv;
  let originalAtlasUri;
  let originalDockerUri;
  let originalMongoUri;

  const importDb = async () => {
    const suffix = `${Date.now()}-${Math.random()}`;
    await import(`../../../api/models/db.js?test=${suffix}`);
  };

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    originalAtlasUri = process.env.MONGODB_ATLAS_URI;
    originalDockerUri = process.env.MONGODB_DOCKER_URI;
    originalMongoUri = process.env.MONGODB_URI;

    connectStub = sinon.stub(mongoose, 'connect');
    onStub = sinon.stub(mongoose.connection, 'on');
    processOnStub = sinon.stub(process, 'on');
    processOnceStub = sinon.stub(process, 'once');
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    connectStub.restore();
    onStub.restore();
    processOnStub.restore();
    processOnceStub.restore();
    consoleLogStub.restore();
    consoleErrorStub.restore();

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalAtlasUri === undefined) {
      delete process.env.MONGODB_ATLAS_URI;
    } else {
      process.env.MONGODB_ATLAS_URI = originalAtlasUri;
    }

    if (originalDockerUri === undefined) {
      delete process.env.MONGODB_DOCKER_URI;
    } else {
      process.env.MONGODB_DOCKER_URI = originalDockerUri;
    }

    if (originalMongoUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalMongoUri;
    }
  });

  it('uses local MongoDB URI by default (non-production)', async () => {
    process.env.NODE_ENV = 'test';
    delete process.env.MONGODB_ATLAS_URI;
    delete process.env.MONGODB_URI;

    await importDb();

    assert.strictEqual(connectStub.calledOnce, true);
    const [uri] = connectStub.firstCall.args;
    assert.strictEqual(uri, 'mongodb://127.0.0.1:27017/tpo');
  });

  it('uses atlas URI in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.MONGODB_ATLAS_URI = 'mongodb+srv://example/atlas';

    await importDb();

    assert.strictEqual(connectStub.calledOnce, true);
    const [uri] = connectStub.firstCall.args;
    assert.strictEqual(uri, 'mongodb+srv://example/atlas');
  });

  it('uses docker URI when NODE_ENV is docker', async () => {
    process.env.NODE_ENV = 'docker';
    process.env.MONGODB_DOCKER_URI = 'mongodb://docker:27017/testdb';

    await importDb();

    assert.strictEqual(connectStub.calledOnce, true);
    const [uri] = connectStub.firstCall.args;
    assert.strictEqual(uri, 'mongodb://docker:27017/testdb');
  });

  it('registers signal handlers for graceful shutdown', async () => {
    await importDb();

    assert.strictEqual(processOnceStub.calledWith('SIGUSR2'), true);
    assert.strictEqual(processOnStub.calledWith('SIGINT'), true);
    assert.strictEqual(processOnStub.calledWith('SIGTERM'), true);
  });

  it('pings database when connected event fires', async () => {
    let connectedHandler;

    onStub.callsFake((event, handler) => {
      if (event === 'connected') {
        connectedHandler = handler;
      }
    });

    const pingStub = sinon.stub().resolves();
    mongoose.connection.db = {
      admin: () => ({ ping: pingStub })
    };

    await importDb();

    assert.ok(connectedHandler);
    await connectedHandler();

    assert.strictEqual(pingStub.calledOnce, true);
  });
});
