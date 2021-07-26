
import { Application } from '../models/application';

export interface ApplicationRepository {
  getApplication(id: string): Promise<Application>
}