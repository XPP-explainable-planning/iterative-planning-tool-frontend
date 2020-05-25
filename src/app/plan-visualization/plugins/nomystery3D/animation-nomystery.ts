import { NoMysteryTask } from '../nomystery/nomystery-task';
import { Action } from 'src/app/interface/plan';
import { AnimationInfoNoMystery } from './animation-info-nomystery';
import { AnimationInitializerNoMystery } from './animation-initializer-nomystery';
import { AnimationProviderNoMystery } from './animation-provider-nomystery';
import { PlanVisualization } from '../../integration/animation';


export class AnimationNoMystery extends PlanVisualization {

  animationInfo: AnimationInfoNoMystery;
  animationInitializer: AnimationInitializerNoMystery;
  animationProvider: AnimationProviderNoMystery;

  constructor(task: NoMysteryTask) {
    super(task);
    this.animationInfo = new AnimationInfoNoMystery(task);
    this.animationInitializer = new AnimationInitializerNoMystery('#planSVG', this.animationInfo);
    this.animationProvider = new AnimationProviderNoMystery(this.animationInfo);
  }

  animateAction(action: Action): Promise<void> {
    return this.animationProvider.animateAction(action);
  }

  reverseAnimateAction(action: Action): Promise<void> {
    return this.animationProvider.reverseAnimateAction(action);
  }

  restart(): void {
    this.animationInitializer.restart();
  }

}
