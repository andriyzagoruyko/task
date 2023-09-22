import { Query, Resolver } from '@nestjs/graphql';
import { StatsDto } from '../dto/stats.dto';
import { StatsService } from '../services/stats.service';

@Resolver(() => StatsDto)
export class StatsResolver {
  constructor(private readonly statsService: StatsService) {}

  @Query(() => StatsDto)
  stats() {
    return this.statsService.getStats();
  }
}
