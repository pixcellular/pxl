class Store {
  public loopDurationMs: number;
  public herbivoreInitialEnergy: number;
  public herbivoreReproductionThreshold: number;
  public herbivoreMetabolismCosts: number;
  public plantGrowEnergy: number;
  public plantCloneThreshold: number;
  public plantGrowLimit: number;
}

export const store = new Store();
store.loopDurationMs = 25;
store.herbivoreInitialEnergy = 1000;
store.herbivoreReproductionThreshold = 3500;
store.herbivoreMetabolismCosts = 20;
store.plantGrowEnergy = 2;
store.plantGrowLimit = 150;
store.plantCloneThreshold = 50;
