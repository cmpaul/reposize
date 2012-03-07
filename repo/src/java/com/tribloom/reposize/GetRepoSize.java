/**
 *    Copyright 2012 Tribloom
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package com.tribloom.reposize;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.alfresco.service.cmr.repository.ContentService;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationConverter;
import org.apache.commons.configuration.MapConfiguration;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class GetRepoSize extends DeclarativeWebScript {

	private static Logger logger = Logger.getLogger(GetRepoSize.class);

	private Properties globalProperties;
	private ContentService contentService;

	public void setGlobalProperties(Properties props) {
		globalProperties = props;
	}
	
	public void setContentService(ContentService service) {
		contentService = service;
	}

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		if (logger.isDebugEnabled()) {
			logger.debug("Entering GetRepoSize.executeImpl()");
		}
		
		Map<String, Object> model = new HashMap<String, Object>();

		// Use Apache Configuration library to perform variable interpolation if
		// necessary
		MapConfiguration config = (MapConfiguration) ConfigurationConverter
				.getConfiguration(globalProperties);
		Configuration intConfig = config.interpolatedConfiguration();
		
		String contentStore = (String) intConfig.getProperty("dir.contentstore");
		String indexes = (String) intConfig.getProperty("dir.indexes");
		String indexesBackup = (String) intConfig.getProperty("dir.indexes.backup");
		
		if (logger.isDebugEnabled()) {
			logger.debug(" contentStorePath = " + contentStore);
			logger.debug(" indexes = " + indexes);
			logger.debug(" indexesBackup = " + indexesBackup);
		}

		try {
			/**
			 * TODO: Figure if there's a need and a way to perform this size request on multiple
			 * stores, configured with the Content Selector Service
			 * 
			 * Can do nodeService.getStores() to get the StoreRef's, but how
			 * to retrieve contentService for these refs? Or does contentService
			 * intelligently handle this?
			 */
			long storeFreeSpace = contentService.getStoreFreeSpace();
			long storeTotalSpace = contentService.getStoreTotalSpace();
			
			if (logger.isDebugEnabled()) {
				logger.debug(" storeFreeSpace = " + storeFreeSpace);
				logger.debug(" storeTotalSpace = " + storeTotalSpace);
			}
			
			long contentStoreSize = getFileSize(new File(contentStore));
			
			if (logger.isDebugEnabled()) {
				logger.debug(" contentStoreSize = " + contentStoreSize);
			}
			
			long indexesSize = getFileSize(new File(indexes));
			long indexesBackupSize = getFileSize(new File(indexesBackup));
			
			if (logger.isDebugEnabled()) {
				logger.debug(" indexesSize = " + indexesSize);
				logger.debug(" indexesBackupSize = " + indexesBackupSize);
			}

			model.put("contentStorePath", contentStore);
			model.put("contentStoreSize", contentStoreSize);
			model.put("storeFreeSpace", storeFreeSpace);
			model.put("storeTotalSpace", storeTotalSpace);
			model.put("indexesPath", indexes);
			model.put("indexesSize", indexesSize);
			model.put("indexesBackupPath", indexesBackup);
			model.put("indexesBackupSize", indexesBackupSize);

		} catch (Exception e) {
			logger.error("Exception encountered during GetRepoSize webscript processing: ", e);
			status.setCode(Status.STATUS_INTERNAL_SERVER_ERROR);
			status.setException(e);
			status.setMessage(e.getMessage());
			status.setRedirect(false);
		}

		if (logger.isDebugEnabled()) {
			logger.debug("Exiting GetRepoSize.executeImpl()");
		}
		return model;
	}

	/**
	 * This is a recursive method. If file is found, total file size is
	 * calculated. If it is a folder, we recurse further.
	 */
	public long getFileSize(File folder) {
		if (logger.isDebugEnabled()) {
			logger.debug("Processing " + folder.getAbsolutePath());
		}
		long foldersize = 0;

		File[] filelist = folder.listFiles();
		if (filelist != null) {
			for (int i = 0; i < filelist.length; i++) {
				if (filelist[i].isDirectory()) {
					foldersize += getFileSize(filelist[i]);
				} else {
					foldersize += filelist[i].length();
				}
			}
		}

		return foldersize;
	}
}
