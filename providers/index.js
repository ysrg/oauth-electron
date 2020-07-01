const path = require('path');

export class MainProviderManager {

  assign = (obj) => {
    for (let i in obj) {
      let field = obj[i];
      if (typeof field === 'function') {
        field = field.bind(this);
      }
      this[i] = field;
    }
  }

}

export const ProviderManager = new MainProviderManager();

export * from './googleProvider';
export * from './yahooProvider';
export * from './outlookProvider';
export * from './mairuProvider';
