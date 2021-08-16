import { ContractFunction } from 'ethers';
import { ThrottledConcurrentQueue } from '@darkforest_eth/network';

export class ContractCaller {
  private static readonly MAX_RETRIES = 12;
  private readonly callQueue = new ThrottledConcurrentQueue(10, 1000, 20);

  public async makeCall<T>(
    contractViewFunction: ContractFunction<T>,
    args: unknown[] = []
  ): Promise<T> {

    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    for (let i = 0; i < ContractCaller.MAX_RETRIES; i++) {
      try {
        return await contractViewFunction(...args);
      } catch (e) {
        await sleep(1000 * 2 ** i + Math.random() * 100);
      }
    }

    throw new Error('failed to call contract');
  }
}
