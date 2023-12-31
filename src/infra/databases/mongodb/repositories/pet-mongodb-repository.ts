import { PetEntityType, PetStatusEnum } from "../../../../domain/protocols";
import { PetMongoDbModel } from "../models/pet-mongodb-model";
import {
  CreatePetsRepositoryIntereface,
  UpdatePetStatusRepositoryIntereface,
  DeleteAllPetsRepositoryIntereface,
  GetPetsRepositoryInterface,
  PetSearchParamsType,
} from "../../../../data/protocols";
import { SearchQueryBuilder } from "../../../builders";

export class PetMongoDBRepository
  implements
    CreatePetsRepositoryIntereface,
    UpdatePetStatusRepositoryIntereface,
    DeleteAllPetsRepositoryIntereface,
    GetPetsRepositoryInterface
{
  public async createPets(pets: PetEntityType[]): Promise<void> {
    await PetMongoDbModel.insertMany(pets);
    return;
  }

  public async updateStatus(
    petId: string,
    newStatus: PetStatusEnum
  ): Promise<PetEntityType | null> {
    const updatedPet = await PetMongoDbModel.findOneAndUpdate(
      { id: petId },
      { status: newStatus },
      { new: true }
    );
    if (!updatedPet) {
      return null;
    }
    return this.map(updatedPet.toObject());
  }

  public async deleteAllPets(): Promise<void> {
    await PetMongoDbModel.deleteMany({});
  }

  public async getPets(
    searchParams: PetSearchParamsType
  ): Promise<PetEntityType[]> {
    const query = new SearchQueryBuilder()
      .ofParams(searchParams)
      .withCallback(this.buildPetSearchParams)
      .build();
    const pets = await PetMongoDbModel.find(query)
      .limit(searchParams.limit)
      .skip(searchParams.offset);
    return pets.map((pet) => this.map(pet.toObject()));
  }

  private buildPetSearchParams(searchParams: PetSearchParamsType): any {
    const query: any = {};
    if (searchParams.term) {
      query.$or = [
        { name: { $regex: new RegExp(searchParams.term, "i") } },
        { description: { $regex: new RegExp(searchParams.term, "i") } },
      ];
    }
    if (searchParams.category) {
      query.category = searchParams.category;
    }
    if (searchParams.status) {
      query.status = searchParams.status;
    }
    if (searchParams.createdAt) {
      query.createdAt = { $eq: searchParams.createdAt };
    }
    return query;
  }

  private map(data: PetEntityType): PetEntityType {
    const petData = data;
    delete (petData as any)._id;
    delete (petData as any).__v;
    return petData;
  }
}
