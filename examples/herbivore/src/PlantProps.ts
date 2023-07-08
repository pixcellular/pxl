import {EntityProps} from 'pixcellular';

export type PlantProps = EntityProps & {
  energy: number
};

export function isPlantProps(props): props is PlantProps {
  if (props.energy) {
    return props;
  }
}
