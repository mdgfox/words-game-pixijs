import { container, DependencyContainer, InjectionToken } from "tsyringe";
import { GameModel } from "../models/GameModel";

export class GameContext {
    protected contextContainer: DependencyContainer;
    constructor() {
        this.contextContainer = container.createChildContainer();
    }

    init() {
        this.contextContainer.register("InitialLevel", { useValue: 1 });

        this.contextContainer.registerSingleton(GameModel, GameModel);
    }

    resolve<T>(token: InjectionToken<T>): T {
        return this.contextContainer.resolve(token);
    }
}