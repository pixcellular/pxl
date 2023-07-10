class Store {
  public herbivoreInitialEnergy: number;
  public herbivoreReproductionThreshold: number;
  public herbivoreMetabolismCosts: number;
  public plantGrowEnergy: number;
  public plantCloneThreshold: number;
}

export const store = new Store();
store.herbivoreInitialEnergy = 90;
store.herbivoreReproductionThreshold = 500;
store.herbivoreMetabolismCosts = 3;
store.plantGrowEnergy = 4;
store.plantCloneThreshold = 40;