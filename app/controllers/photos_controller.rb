class PhotosController < ApplicationController

  def new
    @photo = Photo.new
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @photo }
    end
  end

  def create
    @photo = Photo.new(params[:photo])
    @photo.article_id = params[:id]

    respond_to do |format|
      if @photo.save
        format.html { redirect_to photos.path } #index.html.erb
        format.json { render json: @photo, status: :created, location: @photo }
        format.js
      else
        format.html { render action: "new" }
        format.json { render json: @photo.errors, status: :unprocessable_entity }
      end
    end
  end
  
end
